export function getUseValueRepository() {
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

export function getUseValueManager() {
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

