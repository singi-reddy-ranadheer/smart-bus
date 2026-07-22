"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SmsChannel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmsChannel = void 0;
const common_1 = require("@nestjs/common");
let SmsChannel = SmsChannel_1 = class SmsChannel {
    constructor() {
        this.logger = new common_1.Logger(SmsChannel_1.name);
    }
    async send(payload) {
        // v0.1: Stub for SMS (Twilio to be added)
        this.logger.log(`[SMS] → ${payload.userId}: ${payload.title}`);
        // TODO: Integrate Twilio for real SMS delivery in v0.3
        return true;
    }
};
exports.SmsChannel = SmsChannel;
exports.SmsChannel = SmsChannel = SmsChannel_1 = __decorate([
    (0, common_1.Injectable)()
], SmsChannel);
