package uth.edu.repositories;

import java.util.List;

import org.springframework.stereotype.Repository;

import uth.edu.pojo.Part;

@Repository
public interface IPartRepository {
    public void addPart(uth.edu.pojo.Part Part);
    public void updatePart(uth.edu.pojo.Part Part);
    public void deletePart(uth.edu.pojo.Part Part);
    public uth.edu.pojo.Part getPartById(int partId);
    public List<Part> getAllParts(int page, int pageSize);
    public void closeResources();
}