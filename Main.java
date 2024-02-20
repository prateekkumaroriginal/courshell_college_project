import java.util.ArrayList;
import java.util.List;
import java.util.Random;

abstract class User {
    protected String username;
    protected String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public abstract String getType();

    public abstract void signUp();

    public abstract boolean signIn();
}

class RegularUser extends User {
    public RegularUser(String username, String password) {
        super(username, password);
    }

    @Override
    public String getType() {
        return "Regular User";
    }

    @Override
    public void signUp() {
        System.out.println("Signed up as a Regular User");
    }

    @Override
    public boolean signIn() {
        System.out.println("Signed in as a Regular User");
        return true;
    }
}

class Instructor extends User {
    public Instructor(String username, String password) {
        super(username, password);
    }

    @Override
    public String getType() {
        return "Instructor";
    }

    @Override
    public void signUp() {
        System.out.println("Signed up as an Instructor");
    }

    @Override
    public boolean signIn() {
        System.out.println("Signed in as an Instructor");
        return true;
    }
}

class Course {
    private String title;
    private String description;
    private String courseId;

    public Course(String title, String description) {
        this.title = title;
        this.description = description;
        this.courseId = generateCourseID();
    }

    public String getTitle() {
        return title;
    }

    public String getCourseId() {
        return courseId;
    }

    private String generateCourseID() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        int len = 6;
        StringBuilder id = new StringBuilder();
        Random random = new Random();
        for (int i = 0; i < len; ++i) {
            id.append(chars.charAt(random.nextInt(chars.length())));
        }
        return id.toString();
    }

    public void display() {
        System.out.println("Course ID: " + courseId);
        System.out.println("Title: " + title);
        System.out.println("Description: " + description);
    }
}

class Courshell {
    private List<Course> courses;

    public Courshell() {
        this.courses = new ArrayList<>();
    }

    public void addCourse(Course course) {
        courses.add(course);
    }

    public void displayCourses() {
        System.out.println("Available Courses:");
        for (Course course : courses) {
            course.display();
            System.out.println();
        }
    }
}

public class Main {
    public static void main(String[] args) {
        // Seed random number generator
        Random rand = new Random();

        // Creating instances of users
        RegularUser regularUser = new RegularUser("user123", "password");
        Instructor instructor = new Instructor("instructor1", "password");

        // Signing up and signing in
        regularUser.signUp();
        regularUser.signIn();

        instructor.signUp();
        instructor.signIn();

        // Creating courses
        Course course1 = new Course("Mathematics", "Basic mathematics course");
        Course course2 = new Course("Programming", "Introduction to programming course");
        Course course3 = new Course("LLD", "Low level design for beginners");
        Course course4 = new Course("Web Development", "Introduction to Web Dev");

        // Adding courses to the course selling system
        Courshell courseSystem = new Courshell();
        courseSystem.addCourse(course1);
        courseSystem.addCourse(course2);
        courseSystem.addCourse(course3);
        courseSystem.addCourse(course4);

        // Displaying available courses
        courseSystem.displayCourses();
    }
}
