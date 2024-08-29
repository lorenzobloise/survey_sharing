package it.lorenzobloise.survey_sharing_backend.support;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.comprehend.AmazonComprehend;
import com.amazonaws.services.comprehend.AmazonComprehendClientBuilder;
import com.amazonaws.services.comprehend.model.DetectSentimentRequest;
import com.amazonaws.services.comprehend.model.DetectSentimentResult;
import com.amazonaws.services.comprehend.model.LanguageCode;

import java.nio.ByteBuffer;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.CharsetDecoder;
import java.nio.charset.CodingErrorAction;
import java.nio.charset.StandardCharsets;

public class SentimentAnalysis {

    private static final String awsAccessKey = ""; //Insert AWS access key
    private static final String awsSecretKey = ""; //Insert AWS secret key
    private static final String awsRegion = ""; //Insert AWS region

    private AmazonComprehend comprehendClient() {
        BasicAWSCredentials awsCreds = new BasicAWSCredentials(awsAccessKey, awsSecretKey);
        AWSStaticCredentialsProvider awsStaticCredentialsProvider = new AWSStaticCredentialsProvider(awsCreds);
        return AmazonComprehendClientBuilder.standard().withCredentials(awsStaticCredentialsProvider)
                .withRegion(awsRegion).build();
    }

    public String detectSentimentWithComprehend(String textToAnalize){
        DetectSentimentRequest request = new DetectSentimentRequest()
                                            .withText(trimByBytes(textToAnalize, 500))
                                            .withLanguageCode(LanguageCode.En);
        DetectSentimentResult detectSentimentResult = comprehendClient().detectSentiment(request);
        return detectSentimentResult.getSentiment();
    }

    // Method to trim text to 500 bytes as Comprehend Sync Api Limit
    private String trimByBytes(String str, int lengthOfBytes) {
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        ByteBuffer buffer = ByteBuffer.wrap(bytes);

        if (lengthOfBytes < buffer.limit()) {
            buffer.limit(lengthOfBytes);
        }

        CharsetDecoder decoder = StandardCharsets.UTF_8.newDecoder();
        decoder.onMalformedInput(CodingErrorAction.IGNORE);

        try {
            String output = decoder.decode(buffer).toString();
            return output;
        } catch (CharacterCodingException e) {
            throw new RuntimeException(e);
        }
    }

    // TEST
    /*
    public static void main(String[] args){
        SentimentAnalysis sa = new SentimentAnalysis();
        String feedback = "This survey offers a series of questions that challenge you to do your best. For some people, it can be " +
                "overwhelming, while for others it can be challenging in a positive way. I found it to be a great survey";
        System.out.println(feedback+": "+sa.detectSentimentWithComprehend(feedback));
        String feedback2 = "This survey offers a series of questions that challenge you to do your best. For some people, it can be " +
                "overwhelming, while for others it can be challenging in a positive way. I found it to be boring";
        System.out.println(feedback2+": "+sa.detectSentimentWithComprehend(feedback2));
        String feedback3 = "This survey offers a series of boring questions. I think it's terrible";
        System.out.println(feedback3+": "+sa.detectSentimentWithComprehend(feedback3));
        String feedback4 = "This survey offers a series of questions. I don't have a positive or negative judgement";
        System.out.println(feedback4+": "+sa.detectSentimentWithComprehend(feedback4));
    }

     */

}
