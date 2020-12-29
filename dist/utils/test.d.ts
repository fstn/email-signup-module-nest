/// <reference types="jest" />
export declare function getUseValueRepository(): {
    find: jest.Mock<any, any>;
    findOne: jest.Mock<any, any>;
    save: jest.Mock<any, any>;
    manager: {
        find: jest.Mock<any, any>;
        findOne: jest.Mock<any, any>;
        save: jest.Mock<any, any>;
        metadata: {
            columns: never[];
            connection: {
                options: {
                    type: string;
                };
            };
        };
    };
    metadata: {
        columns: never[];
        connection: {
            options: {
                type: string;
            };
        };
    };
};
export declare function getUseValueManager(): {
    find: jest.Mock<any, any>;
    findOne: jest.Mock<any, any>;
    save: jest.Mock<any, any>;
    metadata: {
        columns: never[];
        connection: {
            options: {
                type: string;
            };
        };
    };
};
