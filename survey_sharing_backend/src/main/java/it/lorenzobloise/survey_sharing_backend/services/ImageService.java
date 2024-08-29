package it.lorenzobloise.survey_sharing_backend.services;

import it.lorenzobloise.survey_sharing_backend.entities.Image;
import it.lorenzobloise.survey_sharing_backend.repositories.ImageRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@AllArgsConstructor
@Service
public class ImageService {

    private ImageRepository imageRepository;

    // POST

    public Image addImage(int[] image, String fileName){
        return imageRepository.save(new Image(image, fileName));
    }

    // GET

    public Optional<Image> getImageById(String imageId){
        return imageRepository.findById(imageId);
    }

    // DELETE

    public void deleteImage(String imageId){
        Optional<Image> result = imageRepository.findById(imageId);
        if(result.isEmpty())
            throw new RuntimeException("Image does not exist");
        imageRepository.delete(result.get());
    }

}
