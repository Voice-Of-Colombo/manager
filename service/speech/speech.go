package speech

import (
	uuid "github.com/satori/go.uuid"
	"github.com/voice-of-colombo/service/database"
	"github.com/voice-of-colombo/service/graph/model"
)

func GetSpeechById(id string) (*model.Speech, error) {
	var speech *model.Speech
	result := database.Db.First(&speech, "id = ?", id)

	if result.Error != nil {
		return nil, result.Error
	}

	return speech, nil
}

func SearchSpeeches(searchCriteria *model.SpeechSearchCriteria) ([]*model.Speech, error) {
	var speeches []*model.Speech
	queryBuider := database.Db.Limit(*searchCriteria.Limit).Offset(*searchCriteria.Offset)

	if searchCriteria.ID != nil {
		queryBuider = queryBuider.Where("id = ?", *searchCriteria.ID)
	}

	result := queryBuider.Find(&speeches)

	if result.Error != nil {
		return nil, result.Error
	}

	return speeches, nil
}

func SaveSpeech(input model.SaveSpeech) (*model.Speech, error) {
	id := func() string {
		if input.ID == nil {
			return uuid.NewV4().String()
		}
		return *input.ID
	}()

	saveSpeech := &model.Speech{
		ID:         id,
		SpeechType: input.SpeechType,
		MeetingID:  input.MeetingID,
		UserID:     input.UserID,
		Timestamp:  input.Timestamp,
		Location:   input.Location,
		Project:    input.Project,
		SpeechLink: input.Project,
	}

	result := database.Db.Save(saveSpeech)

	if result.Error != nil {
		return nil, result.Error
	}

	return saveSpeech, nil
}

func GetSpeechesByParentId(parentSpeechId string) ([]*model.Speech, error) {
	var speeches []*model.Speech
	result := database.Db.Where("parent_speech_id = ?", parentSpeechId).Find(&speeches)

	if result.Error != nil {
		return nil, result.Error
	}

	return speeches, result.Error
}
