import React, {useEffect, useState} from "react";

import Moment from "react-moment";
import {Alert, Badge, Button, Container, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";

import {SITE} from "../Services";
import {GetAccessToken, GetRefreshToken} from "../Tokens";
import Navigation from "./Navigation";
import WithServices from "./WithService";

const Video = ({Service}) => {

    const [video, setVideo] = useState({});
    const [show, setShow] = useState(false);

    const url = window.location.href.split('/');
    const video_id = url[url.length - 1];

    useEffect(async () => {
        await Service.video(video_id)
            .then(res => {
                setVideo(res);
            })
            .catch(error => console.log(error));
    }, [video_id]);

    const to_vote = async (vote) => {
        await Service.vote({vote, video_id}, GetAccessToken())
            .then(res => {
                if (res.detail) {
                    setShow(true);
                    document.querySelector('#error').textContent = res.detail;
                } else {
                    setVideo(res);
                }
            })
            .catch(error => {
                if (error.message.indexOf('401') + 1) {
                    setShow(true);
                    document.querySelector('#error').textContent = 'You not authorized';
                } else if (error.message.indexOf('403') + 1) {
                    setShow(true);
                    document.querySelector('#error').textContent = 'You not activated'
                }
                console.log(error);
            });
    };

    const like = () => {
        to_vote(1);
    };

    const dislike = () => {
        to_vote(0);
    };

    return (
        <>
            <Navigation/>
            <Container>
                {
                    video.id ? (
                        <Row className="text-center">
                            <h1>{video.title}</h1>
                            {
                                show ? (
                                    <Alert variant="warning" onClose={() => setShow(false)}>
                                        <div className="d-flex justify-content-end">
                                            <Button
                                                onClick={() => setShow(false)}
                                                variant="warning"
                                                style={{color: "#000"}}
                                            >
                                                X
                                            </Button>
                                        </div>
                                        <p id="error"/>
                                    </Alert>
                                ) : null
                            }
                            <div className="col-md-8">
                                <div className="video">
                                    <video
                                        controls
                                        poster={`${SITE}${video.preview_file}`}
                                        className="container-fluid"
                                    >
                                        <source
                                            src={`${SITE}videos/video/${video.id}`}
                                            type="video/mp4"
                                        />
                                        <source
                                            src={`${SITE}videos/video/${video.id}`}
                                            type="video/webm"
                                        />
                                    </video>
                                </div>

                                <p className="text-start">{video.description}</p>
                            </div>

                            <div className="col-md-4">
                                <ListGroup>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Category</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        {video.category.name}
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Author</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        {video.user.username}
                                        <Image
                                            src={`${SITE}${video.user.avatar}`}
                                            className="avatar"
                                        />
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Statistic</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        Votes:
                                        <span id="like" onClick={like}>
                                            👍 <Badge pill bg="success">{video.votes.likes}</Badge>
                                        </span>
                                        <span id="dislike" onClick={dislike}>
                                            👎 <Badge pill bg="danger">{video.votes.dislikes}</Badge>
                                        </span>
                                    </ListGroupItem>
                                    <ListGroupItem>
                                        Views: <Badge pill bg="success">{video.views}</Badge>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <span className="h4 fw-bold">Created at</span>
                                    </ListGroupItem>

                                    <ListGroupItem>
                                        <Moment date={video.created_at} format="DD.MM.YYYY"/>
                                    </ListGroupItem>

                                </ListGroup>
                            </div>

                        </Row>
                    ) : null
                }
            </Container>
        </>
    );

}

export default WithServices()(Video);