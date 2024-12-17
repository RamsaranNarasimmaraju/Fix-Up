export interface FeedbackCreateDto {
    ticketId:number;
    rating:number;
    comments:string;
    submitteddate:Date;

}
export interface FeedbackReadDto {
    feedbackId:number;  
    ticketId:number;
    rating:number;
    comments:string;
    submitteddate:Date;
}
