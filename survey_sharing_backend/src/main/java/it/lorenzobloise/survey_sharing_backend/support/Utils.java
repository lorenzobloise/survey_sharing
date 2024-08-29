package it.lorenzobloise.survey_sharing_backend.support;

import java.time.LocalDateTime;
import java.util.Arrays;

public class Utils {

    public static String[] parseDate(String date){
        // Input example: 2024-06-12T23:01:19.438977
        // [    2   0   2   4   -   0   6   -   1   2   T   2   3   :   0   1   :   1   9   .   4   3   8   9   7   7   ]
        // [    0   1   2   3   4   5   6   7   8   9   10  11  12  13  14  15  16  17  18  19  20  21  22  23  24  25  ]
        String[] ret = new String[6];
        ret[0] = date.substring(8,10); // Day
        ret[1] = date.substring(5,7); // Month
        ret[2] = date.substring(0,4); // Year
        ret[3] = date.substring(11,13); // Hour
        ret[4] = date.substring(14,16); // Minutes
        ret[5] = date.substring(17,19); // Seconds
        return ret;
    }

}
