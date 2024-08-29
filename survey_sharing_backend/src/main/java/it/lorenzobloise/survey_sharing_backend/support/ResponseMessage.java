package it.lorenzobloise.survey_sharing_backend.support;

public class ResponseMessage {

    private String message;
    private Object object;

    public ResponseMessage(String message,Object object) {
        this.message = message;
        this.object = object;
    }

    public ResponseMessage(String message) {
        this.message = message;
        this.object = null;
    }

    public String getMessage() {
        return message;
    }

    public Object getObject(){
        return object;
    }

}
