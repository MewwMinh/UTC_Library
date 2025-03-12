package edu.utc.demo_01.repository;

import edu.utc.demo_01.entity.Book;
import edu.utc.demo_01.entity.User;
import edu.utc.demo_01.entity.UserFavorite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, String> {
    boolean existsByUserIDAndBookID(User userID, Book bookID);
    void deleteByUserIDAndBookID(User userID, Book bookID);
}