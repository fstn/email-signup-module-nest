import { Candidate } from "../../candidate/candidate.entity";
export declare class SubscribeEmailDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    constructor(candidate: Candidate, password: string);
}
