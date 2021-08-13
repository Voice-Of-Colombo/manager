package meeting

import (
	uuid "github.com/satori/go.uuid"
	"github.com/voice-of-colombo/service/database"
	"github.com/voice-of-colombo/service/graph/model"
)

func GetMeetingById(id string) (*model.Meeting, error) {
	var meeting *model.Meeting
	result := database.Db.First(&meeting, "id = ?", id)

	if result.Error != nil {
		return nil, result.Error
	}

	return meeting, nil
}

func SearchMeetings(searchCriteria *model.MeetingSearchCriteria) ([]*model.Meeting, error) {
	var meetings []*model.Meeting
	queryBuider := database.Db.Limit(*searchCriteria.Limit).Offset(*searchCriteria.Offset)
	result := queryBuider.Find(&meetings)

	if result.Error != nil {
		return nil, result.Error
	}

	return meetings, nil
}

func CreateMeeting(input model.CreateMeeting) (*model.Meeting, error) {
	id := func() string {
		if input.ID == nil {
			return uuid.NewV4().String()
		}
		return *input.ID
	}()

	jointMeetingClubName := func() string {
		if input.JointMeetingClubName == nil {
			return ""
		}
		return *input.JointMeetingClubName
	}()

	newMeeting := &model.Meeting{
		ID:                   id,
		Number:               input.Number,
		Theme:                input.Theme,
		Location:             input.Location,
		JointMeetingClubName: &jointMeetingClubName,
		IsAreaMeeting:        input.IsAreaMeeting,
		Timestamp:            input.Timestamp,
	}

	result := database.Db.Save(newMeeting)

	if result.Error != nil {
		return nil, result.Error
	}

	return newMeeting, nil
}
