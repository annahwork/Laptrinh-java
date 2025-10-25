package edu.vn.ev_wms;

public abstract class User {

    private int UserID;
    private String UserName;
    private String Password;
    private String Name;
    private String Email;
    private String Phone;

    public User(){}

    public User(String UserName, String Password, String Name)
    {
        this.UserName = UserName;
        this.Password = Password;
        this.Name = Name;
    }

    public int getUserID(){
        return this.UserID;
    }

    public String getUserName(){
        return this.UserName;
    }

    public String getPassword(){
        return this.Password;
    }

    public String getName(){
        return this.Name;
    }

    public String getEmail(){
        return this.Email;
    }

    public String getPhone(){
        return this.Phone;
    }

    public void setUserID(int UserID){
        this.UserID = UserID;
    }

    public void setUserName(String UserName){
        this.UserName = UserName;
    }

    public void setPassword(String Password){
        this.Password = Password;
    }

    public void setName(String Name){
        this.Name = Name;
    }

    public void setEmail(String Email){
        this.Email = Email;
    }

    public void setPhone(String Phone){
        this.Phone = Phone;
    }

    public String toString() {
        return "User{" +
                "UserID=" + UserID +
                ", UserName='" + UserName + '\'' +
                ", Password='" + Password + '\'' +
                ", Name='" + Name + '\'' +
                ", Email='" + Email + '\'' +
                ", Phone='" + Phone + '\'' +
                '}';
    }

    

}
