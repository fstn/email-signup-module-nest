"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUseValueManager = exports.getUseValueRepository = void 0;
function getUseValueRepository() {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        manager: getUseValueManager(),
        metadata: {
            columns: [],
            connection: {
                options: {
                    type: ""
                }
            }
        }
    };
}
exports.getUseValueRepository = getUseValueRepository;
function getUseValueManager() {
    return {
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        metadata: {
            columns: [],
            connection: {
                options: {
                    type: ""
                }
            }
        }
    };
}
exports.getUseValueManager = getUseValueManager;
//# sourceMappingURL=test.js.map