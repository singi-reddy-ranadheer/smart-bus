"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var NotificationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const push_channel_1 = require("./channels/push.channel");
const email_channel_1 = require("./channels/email.channel");
const sms_channel_1 = require("./channels/sms.channel");
let NotificationService = NotificationService_1 = class NotificationService {
    constructor(pushChannel, emailChannel, smsChannel) {
        this.pushChannel = pushChannel;
        this.emailChannel = emailChannel;
        this.smsChannel = smsChannel;
        this.logger = new common_1.Logger(NotificationService_1.name);
        this.store = [];
        this.channels = {
            push: pushChannel,
            email: emailChannel,
            sms: smsChannel,
            in_app: { send: async (p) => this.deliverInApp(p) },
        };
    }
    async deliverInApp(payload) {
        this.logger.log(`[IN_APP] → ${payload.userId}: ${payload.title}`);
        return true;
    }
    async sendWithRetry(channel, payload, maxRetries = 2) {
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await channel.send(payload);
                if (result)
                    return true;
            }
            catch (err) {
                this.logger.warn(`Attempt ${attempt + 1} failed: ${err.message}`);
            }
            if (attempt < maxRetries) {
                await new Promise((r) => setTimeout(r, 100 * Math.pow(2, attempt)));
            }
        }
        return false;
    }
    async send(dto) {
        const payload = {
            userId: dto.user_id,
            type: dto.type,
            title: dto.title,
            body: dto.body,
            data: dto.data,
        };
        const channel = this.channels[dto.type] || this.channels.in_app;
        const delivered = await this.sendWithRetry(channel, payload);
        const record = {
            id: (0, uuid_1.v4)(),
            userId: dto.user_id,
            type: dto.type,
            title: dto.title,
            body: dto.body,
            data: dto.data || null,
            is_read: false,
            sent_at: new Date().toISOString(),
            delivered,
        };
        this.store.push(record);
        return record;
    }
    async broadcast(userIds, dto) {
        const results = [];
        for (const userId of userIds) {
            results.push(await this.send({ user_id: userId, ...dto }));
        }
        return results;
    }
    async listForUser(userId, page = 1, limit = 20) {
        const userNotifs = this.store.filter((n) => n.userId === userId);
        const from = (page - 1) * limit;
        const to = from + limit;
        return {
            data: userNotifs.slice(from, to),
            meta: {
                page,
                limit,
                total: userNotifs.length,
                totalPages: Math.ceil(userNotifs.length / limit),
            },
        };
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = NotificationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [push_channel_1.PushChannel,
        email_channel_1.EmailChannel,
        sms_channel_1.SmsChannel])
], NotificationService);
