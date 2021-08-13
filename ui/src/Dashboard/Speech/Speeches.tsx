import { gql, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Form,
  Input,
  Row, Select, Tag
} from "antd";
import Layout, { Content } from "antd/lib/layout/layout";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Route, useHistory, useParams, useRouteMatch, Switch } from "react-router-dom";
import { PAGE_SEARCH_CRITERIA } from "../../Constants";
import { useAuthUserStorage } from "../../Login/UseUserStorage.hooks";
import { usePaginationDetection, usePaginationQuery } from "../../PaginationHooks";
import SpeechDetail from "./SpeechDetail";
import "./Speeches.scss";

const GET_SPEECHES = gql`
  query GetSpeeches($limit: Int $offset: Int) {
    speeches(searchCriteria: { limit: $limit offset: $offset }) {
      id
      speechType,
      timestamp,
      title,
      user {
        id,
        firstName,
        lastName
      },
      meeting {
        id,
        theme
      }
    }
  }
`;

const GET_USERS = gql`
  query GetUsers($limit: Int $offset: Int) {
    users(searchCriteria: { limit: $limit offset: $offset } ) {
      id
      firstName,
      lastName,
      email,
      isAdmin
    }
  }
`;

const PAGE_SIZE = 8;
const DATA_KEY = 'speeches';

export default function Speeches(this: any) {
  const [pageNumber, setPageNumber] = useState(0)
  const [speeches, loading, error, hasMore] = usePaginationQuery<any>(GET_SPEECHES, DATA_KEY, PAGE_SIZE, pageNumber)
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS, PAGE_SEARCH_CRITERIA);

  const [lastElementRef] = usePaginationDetection(loading, hasMore, setPageNumber);
  const [selectedSpeechId, setSelectedSpeechId] = useState('')
  const history = useHistory();
  const match = useRouteMatch();
  const [authUser] = useAuthUserStorage();
  const { id } = useParams() as any;

  useEffect(() => {
    id && setSelectedSpeechId(id);
  }, []);

  function createSpeech(id?) {
    const baseUrl = `${match.path}/create`;
    const processedUrl = (id)
      ? `${baseUrl}/${id}`
      : baseUrl;
    history.push(processedUrl)
  }

  function getSearchFilterHeader(this: any) {
    const { Option } = Select;

    const speechOptions = [
      { value: 'Prepared_Speech', label: "Prepared Speech" },
      { value: 'Table_Topic', label: "Table Topic" },
      { value: 'Evaluation', label: "Evaluation" },
      { value: 'Other', label: "Other" }];

    function tagRender(props) {
      const { label, value, closable, onClose } = props;
      const onPreventMouseDown = event => {
        event.preventDefault();
        event.stopPropagation();
      };

      return (
        <Tag
          color={getSpeechTypeColor(value)}
          onMouseDown={onPreventMouseDown}
          closable={closable}
          onClose={onClose}
          style={{ marginRight: 3 }}
        >
          {label}
        </Tag>
      );
    }

    return (
      <Form layout="inline">
        <Form.Item name="user">
          <Select loading={usersLoading} style={{ width: '200px' }}>
            { usersData?.users && !usersError &&
              usersData.users.map(user => (
                <Option value={user.id} key={user.id}>{user.firstName} {user.lastName}</Option>
              ))
            }
          </Select>
        </Form.Item>
        <Form.Item>
        <Select
          placeholder="Speech Types"
          maxTagCount={0}
          maxTagPlaceholder={(list) => `${list.length} Selected`}
          mode="multiple"
          showArrow
          tagRender={tagRender}
          style={{ width: '200px' }}
          options={speechOptions}
        />
        </Form.Item>
        <Form.Item name="title">
          <Input  placeholder="Title" />
        </Form.Item>
        { authUser?.isAdmin && 
          <Form.Item name="username">
            <Button type="primary" onClick={() => createSpeech.bind(this)()}>
              Create
            </Button>
          </Form.Item>
        }

      </Form>
    )
  }

  function getSpeechTypeColor(speechType) {
    switch(speechType) {
      case 'Prepared_Speech':
        var color = 'cyan'
        break;
      case 'Table_Topic':
        var color = 'blue';
        break;
      case 'Evaluation':
        var color = 'orange';
        break;
      default:
        var color = 'maroon';
        break; 
    }
    return color;
  }

  function getSpeechType(speechType: string) {
    return (
      <span className="tag">
        <Tag color={getSpeechTypeColor(speechType)}>{speechType.replaceAll('_', ' ')}</Tag>
      </span>
    )
  }

  function getSpeechRow(speech: any) {
    const speechRowClass = () => {
      const baseClass = `speech-row`;
      return (speech.id == selectedSpeechId)
        ? `${baseClass} selected`
        : baseClass;
    };

    const selectSpeech = (id) => {
      setSelectedSpeechId(id);

      const urlPath = (match.path === '/speeches')
        ? `${match.path}/${id}`
        : id;

      history.push(urlPath);
    }

    return (
      <Row className={speechRowClass()} onClick={() => selectSpeech(speech.id)}>
        <div className="date">{moment.unix(speech.timestamp).format("MMM DD")}</div>
        <Col span={24}>
          <div className="user">{speech.user.firstName} {speech.user.lastName}</div>
        </Col>
        <Col span={24}>
          <div className="title">{speech.title}</div>
        </Col>
        {/* <Col span={24}>
          <div>Location</div>
          <div>{speech.location}</div>
        </Col> */}
        <Col span={24}>
          {getSpeechType(speech.speechType)}
        </Col>
      </Row>
    )
  }

  return (
    <Layout className="revert-header-margin inner-layout--xl speeches-viewer">
      <Content className="speeches-content">
        <Row className="search-row">
          <Col span={24}>
            {getSearchFilterHeader()}
          </Col>
        </Row>
        <Row className="speeches-section">
          <Col span={6} className="speech-list">
            <div>
            {speeches.map((speech: any, index) => {
              if(speeches.length == (index + 1)) {
                return (
                  <div ref={lastElementRef} key={index}>
                    {getSpeechRow(speech)}
                  </div>
                )
              }
              return (
                <div key={index}>
                  {getSpeechRow(speech)}
                </div> 
              )
            })}
            { loading &&
              <div>Loading</div>
            }
            { error && 
              <div>
                An error occurred while loading data
              </div>
            }
            </div>
          </Col>
          <Col span={18} className="speeches-section-child-wrapper">
            <Switch>
              <Route path={`${match.path}/:id`}>
                <SpeechDetail />
              </Route>
              <Route path={`${match.path}`}>
                <SpeechDetail />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
}
