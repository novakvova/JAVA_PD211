package org.example.util;

import org.example.entities.Genre;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

public class HibernateUtil {
    //Повертає фабрику для підключення до БД
    private static SessionFactory sessionFactory;

    //Це метод, який визиваться автоматично, без протреби створення класу
    static {
        try {
            var config = new Configuration()
                    .configure(); //шукаємо стандартку конфігурацію, тобто файл hibernate.cfg.xml
            config.addAnnotatedClass(Genre.class);
            sessionFactory = config.buildSessionFactory();
            System.out.println("------Ми підлкючлися до БД-----");
        } catch (Exception ex) {
            System.out.println("Помилка при підключенні до БД! "+ ex.getMessage());
        }
    }

    public static SessionFactory getSessionFactory() {
        return sessionFactory;
    }
    public static Session getSession() {
        return sessionFactory.openSession();
    }
    public static void shutdown() {
        if(sessionFactory!=null) {
            sessionFactory.close();
        }
    }
}
