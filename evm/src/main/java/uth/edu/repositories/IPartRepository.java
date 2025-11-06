package uth.edu.repositories;

public interface IPartRepository {
    public void addPart(uth.edu.pojo.Part Part);
    public void updatePart(uth.edu.pojo.Part Part);
    public void deletePart(uth.edu.pojo.Part Part);
    public uth.edu.pojo.Part getPartById(int partId);
    public java.util.List<uth.edu.pojo.Part> getAllParts(int page, int pageSize);
    public void closeResources();
}