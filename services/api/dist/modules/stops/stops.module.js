"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StopsModule = void 0;
const common_1 = require("@nestjs/common");
const stops_controller_1 = require("./stops.controller");
const stops_service_1 = require("./stops.service");
const supabase_service_1 = require("../../database/supabase.service");
let StopsModule = class StopsModule {
};
exports.StopsModule = StopsModule;
exports.StopsModule = StopsModule = __decorate([
    (0, common_1.Module)({
        controllers: [stops_controller_1.StopsController],
        providers: [stops_service_1.StopsService, supabase_service_1.SupabaseService],
        exports: [stops_service_1.StopsService],
    })
], StopsModule);
//# sourceMappingURL=stops.module.js.map