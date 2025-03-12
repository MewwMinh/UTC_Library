package edu.utc.demo_01.repository;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserFavoriteRepository extends JpaRepository<UserFavorite, String> {
  boolean existsByUserIDAndBookID(User user, Book book);
}