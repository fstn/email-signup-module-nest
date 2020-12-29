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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribeEmailDto = void 0;
const class_validator_1 = require("class-validator");
class SubscribeEmailDto {
    constructor(candidate, password) {
        this.firstName = candidate.firstName;
        this.lastName = candidate.lastName;
        this.email = candidate.email;
        this.password = password;
    }
}
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsAlphanumeric(),
    __metadata("design:type", String)
], SubscribeEmailDto.prototype, "firstName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    class_validator_1.IsAlphanumeric(),
    __metadata("design:type", String)
], SubscribeEmailDto.prototype, "lastName", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], SubscribeEmailDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsString(),
    __metadata("design:type", String)
], SubscribeEmailDto.prototype, "password", void 0);
exports.SubscribeEmailDto = SubscribeEmailDto;
//# sourceMappingURL=subscribe-email.dto.js.map