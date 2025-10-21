package edu.vn.ev_wms;

public class ClaimPart {
    
    private String ClaimPartID;
    private String Description;
    private String ActionTaken;
    private String Quantity;

    public ClaimPart(){}

    public ClaimPart(String ClaimPartID, String Description, String ActionTaken, String Quantity)
    {
        this.ClaimPartID = ClaimPartID;
        this.Description = Description;
        this.ActionTaken = ActionTaken;
        this.Quantity = Quantity;
    }

    public String getClaimPartID(){
        return this.ClaimPartID;
    }

    public String getDescription(){
        return this.Description;
    }

    public String getActionTaken(){
        return this.ActionTaken;
    }

    public String getQuantity(){
        return this.Quantity;
    }

    public void setClaimPartID(String ClaimPartID){
        this.ClaimPartID = ClaimPartID;
    }

    public void setDescription(String Description){
        this.Description = Description;
    }

    public void setActionTaken(String ActionTaken){
        this.ActionTaken = ActionTaken;
    }

    public void setQuantity(String Quantity){
        this.Quantity = Quantity;
    }

}
