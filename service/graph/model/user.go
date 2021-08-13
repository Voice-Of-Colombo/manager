package model

import "gorm.io/gorm"

type User struct {
	gorm.Model
	ID        string `json:"id"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
	Password  string
	IsAdmin   bool `json:"isAdmin" gorm:"default:false"`
}
