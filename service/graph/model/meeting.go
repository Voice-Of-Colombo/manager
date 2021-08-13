package model

import "gorm.io/gorm"

type Meeting struct {
	gorm.Model
	ID                   string  `json:"id"`
	Number               int     `json:"number"`
	Theme                string  `json:"theme"`
	Location             string  `json:"location"`
	JointMeetingClubName *string `json:"jointMeetingClubName"`
	IsAreaMeeting        bool    `json:"isAreaMeeting"`
	Timestamp            int     `json:"timestamp"`
}
