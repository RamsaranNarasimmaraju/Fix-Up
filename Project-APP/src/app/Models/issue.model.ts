export interface IssueReadDto {
    issueId:number;
    issueCategory:string;

}
export interface IssueCreateDto{

    issueCategory:string;

}
export interface IssueUpdateDto
{
    issueId:number;
    issueCategory:string;
}
