export interface UserReadDto {
  userId: number;
  userName: string;
  email: string;
  roleId: number;
  userPassword?: string;  
  dateCreated: string;  // This will be the ISO date string
}

      
      
      export interface UserUpdateDto{
    
   
        userId: number; 
        userName: string;
        email: string;
        userPassword?: string;   
        
       
      }
      
      export interface UserCreateDto{
    
  
        userName: string;
        email: string;
        userPassword: string;
        roleId: number;
        dateCreated?: string; 
       
      }
      
      
      

