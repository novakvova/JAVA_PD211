package org.example;

import org.example.entities.Genre;
import org.example.util.HibernateUtil;

public class Main {

    //UserName - dowik44272@kuandika.com
    //Password = dowik44272@kuandika.comQ
    //postgresql://neondb_owner:npg_5SMINwZlU3mB@ep-icy-smoke-a54k5of0-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require

    public static void main(String[] args) {
        var session = HibernateUtil.getSession();
        try {
            session.beginTransaction();

            var genre = new Genre();
            genre.setName("Стрилялка");
            //session.save(genre);
            session.persist(genre);

            session.getTransaction().commit();

        }catch (Exception ex) {
            System.out.println("Щось пішло не так! "+ ex.getMessage());
        }
    }
}