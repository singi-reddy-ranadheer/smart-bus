"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var PushChannel_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushChannel = void 0;
const common_1 = require("@nestjs/common");
let PushChannel = PushChannel_1 = class PushChannel {
    constructor() {
        this.logger = new common_1.Logger(PushChannel_1.name);
    }
    async send(payload) {
        // v0.1: Stub for push notifications (Firebase Admin SDK to be added)
        this.logger.log(`[PUSH] → ${payload.userId}: ${payload.title}`);
        // TODO: Integrate firebase-admin for real push delivery in v0.3
        return true;
    }
};
exports.PushChannel = PushChannel;
exports.PushChannel = PushChannel = PushChannel_1 = __decorate([
    (0, common_1.Injectable)()
], PushChannel);
