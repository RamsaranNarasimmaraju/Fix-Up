export interface CustomIssueCreateDto {
    cutomIssue:string;
    customSolution?:string;
    userid:number;
}
export interface CustomIssueReadDto {
    customId:number;
    cutomIssue:string;
    customSolution:string;
    userid:number;
}
export interface CustomIssueUpdateDto {
    customId:number;
    cutomIssue:string;
    customSolution:string;
    userid:number;
}


