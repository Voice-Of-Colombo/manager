import { DownloadOutlined, ShareAltOutlined } from '@ant-design/icons';
import { gql, useLazyQuery } from "@apollo/client";
import {
  Button,
  Col,
  Empty, Row, Spin,
  Table,
  Tag
} from "antd";
import moment from "moment";
import React, { useEffect } from "react";
import ReactPlayer from 'react-player';
import { useHistory, useParams } from "react-router-dom";
import "./SpeechDetail.scss";


const GET_SPEECHES = gql`
  query GetSpeeches($speechId: ID) {
    speeches(searchCriteria: { limit: 1 offset: 0, id: $speechId }) {
      id
      speechType,
      timestamp,
      title,
      actualTime,
      expectedTime,
      user {
        id,
        firstName,
        lastName
      },
      meeting {
        id,
        theme
      },
      ahCounts {
        id,
        ah,
        um,
        er,
        well,
        so,
        like,
        but,
        repeats,
        other
      },
      childSpeeches {
        id,
        title,
        timestamp,
        location, 
        user {
          id,
          firstName,
          lastName
        }
      },
      parentSpeech {
        id,
        title
      }
    }
  }
`;


export default function SpeechDetail(this: any) {
  const { id: speechId } = useParams() as any;
  const [loadSpeech,  { loading, error, data }] = useLazyQuery(GET_SPEECHES);
  const history = useHistory();

  useEffect(() => {
    speechId && loadSpeech({ variables: { speechId: speechId }});
  }, [speechId]);


  const columns = [
    {
      title: 'Evaluator',
      dataIndex: 'user',
      key: 'user',
      render: user => <a>{user.firstName} {user.lastName}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: timestamp => {
        return moment.unix(timestamp).format("MMM DD, YYYY")
      },
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title'
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
    },
  ];
  
  function getAhCounterGrid(ahCounts) {
    return (
      <div className="ah-counter-grid">
        <table>
          <tr>
            <th>Ah</th>
            <th>Um</th>
            <th>Er</th>
            <th>Well</th>
            <th>So</th>
            <th>Like</th>
            <th>But</th>
            <th>Repeats</th>
            <th>Other</th>
          </tr>
          <tr>
            <td>{ahCounts.ah}</td>
            <td>{ahCounts.um}</td>
            <td>{ahCounts.er}</td>
            <td>{ahCounts.well}</td>
            <td>{ahCounts.so}</td>
            <td>{ahCounts.like}</td>
            <td>{ahCounts.but}</td>
            <td>{ahCounts.repeats}</td>
            <td>{ahCounts.other}</td>
          </tr>
        </table>
      </div>
    )
  }
  
  function getSpeechType(speechType: string) {
    let color = 'maroon';
    switch(speechType) {
      case 'Prepared_Speech':
        color = 'cyan'
        break;
      case 'Table_Topic':
        color = 'blue';
        break;
      case 'Evaluation':
        color = 'orange';
        break;
    }

    return (
      <span className="tag">
        <Tag color={color}>{speechType.replaceAll('_', ' ')}</Tag>
      </span>
    )
  }

  if(!speechId || !data?.speeches) {
    return (
      <div className="speech-viewer no-speech">
        <div>
          <Empty description={<span>No Speech Selected</span>} />
        </div>
      </div>
    )
  }

  if(loading) {
    return (
      <div className="speech-viewer no-speech">
        <Spin size="large" delay={200}>
        </Spin>
      </div>
    )
  }

  if(error) {
    return (
      <div className="speech-viewer no-speech">
        <div>An error occurred</div>
      </div> 
    )
  }

  const [speech] = data.speeches;
  
  const onRowEvents = (record) => {
    return {
      onClick: _event => {
        history.push(record.id)
      }, 
    };
  };

  return (
    <div className="speech-viewer">
      <Row>
        <Col>
          <div>
            <div className="user">
              {speech.user.firstName} {speech.user.lastName}
            </div>
            <span className="title">
              {speech.title}
            </span>
            <span className="speech-type">
              {getSpeechType(speech.speechType)}
            </span>
          </div>
          <div>
            { /* Only the speech owner should be able to see */ }
            <Button type="primary" icon={<ShareAltOutlined />} size={"small"} >
              Share
            </Button>
            <Button type="primary" style={{marginLeft: "10px" }} icon={<DownloadOutlined />} size={"small"} >
              Reference
            </Button>
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          <div className="video-wrapper">
            { speech.actualTime && 
              <div>
                <span className="timing">
                  <span>{speech.actualTime} ({speech.expectedTime})</span>
                </span>
              </div>
            }
            <div>
              <ReactPlayer url='https://www.youtube.com/watch?v=SCQGnVrTsAM' />
            </div>
            { speech.ahCounts &&
              <div>{getAhCounterGrid(speech.ahCounts)}</div>
            }
          </div>
        </Col>
      </Row>
      <Row justify="center">
        <Col>
          
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Table onRow={onRowEvents} size="small" columns={columns} dataSource={speech.childSpeeches} />
        </Col>
      </Row>
    </div>
  );
}
