package model

import "gorm.io/gorm"

type Speech struct {
	gorm.Model
	ID             string  `json:"id"`
	MeetingID      *string `json:"meetingId"`
	SpeechType     string  `json:"speechType"`
	Timestamp      *int    `json:"timestamp"`
	Location       *string `json:"location"`
	Project        *string `json:"project"`
	UserID         string  `json:"userId"`
	SpeechLink     *string `json:"speechLink"`
	Title          string  `json:"title"`
	ParentSpeechID *string `json:"parentSpeechId"`
	ActualTime     string  `json:"actualTime"`
	ExpectedTime   string  `json:"expectedTime"`
	// AhCountsID     *string `json:"ahCounts"`
}

// type Speech struct {
// 	gorm.Model
// 	ID           string    `json:"id"`
// 	Title        string    `json:"title"`
// 	User         *User     `json:"user"`
// 	Meeting      *Meeting  `json:"meeting"`
// 	SpeechType   string    `json:"speechType"`
// 	Timestamp    *int      `json:"timestamp"`
// 	Location     *string   `json:"location"`
// 	Project      *string   `json:"project"`
// 	SpeechLink   *string   `json:"speechLink"`
// 	ParentSpeech *Speech   `json:"parentSpeech"`
// 	ActualTime   string    `json:"actualTime"`
// 	ExpectedTime string    `json:"expectedTime"`
// 	AhCounts     *AhCounts `json:"ahCounts"`
// }
