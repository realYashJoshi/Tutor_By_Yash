import React, { Component } from "react";
import "./style.css";
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Like from './Like/Like';
import API from './../../../utils/API';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularProgress from '@material-ui/core/CircularProgress';

class Posts extends Component {
	constructor() {
		super();
		this.state = {
			comment: '',
			commentPostId: '',
			postState: '',
			showcomment: [],
			posts: [],
			skip: 0,
			morePosts: true
		}
	}

	componentDidMount() {
		this.loadPosts(this.state.skip);
	}

	loadPosts = (skip) => {
		API.getPosts(skip)
			.then(res => {
				if (res.data.length !== 0) {
					this.setState({ ...this.state, posts: [...this.state.posts, ...res.data] })
				} else {
					this.setState({ morePosts: false })
				}
			})
			.catch(err => console.log(err));
	};

	inputCommentChange = (event) => {
		this.setState({ comment: event.target.value })
	}

	loadComments = (postId) => {
		API.loadComments(postId)
			.then(res => {
				console.log(res)
				this.setState({ showcomment: res.data.comments.comment });
				var commentModal = document.getElementsByClassName("modal-comment-body")[0];
				commentModal.innerHTML = "";
				this.state.showcomment.map(comment => (
					commentModal.innerHTML += "<p><strong>" + comment.user.name + "</strong>: " + comment.text + "</p>"
				))
			})
			.catch(err => console.log(err));
	}

	submitComment = (e) => {
		e.preventDefault();
		API.setComment({ user: this.props.userId, postId: this.state.commentPostId, comment: this.state.comment })
			.then(res => {
				this.setState({ comment: "" })
				this.loadComments(this.state.commentPostId);
			})
			.catch(err => console.log(err));
	}

	clickComment = (postId) => {
		this.setState({ commentPostId: postId })
		this.loadComments(postId)
	}

	fetchMoreData = () => {
		this.setState({ skip: this.state.skip + 4 }, () => {
			setTimeout(() => {
				this.loadPosts(this.state.skip)
			}, 1500);
		})
	}

	render() {
		return (
			<div>
				<div className="modal fade" id="likeModalCenter" role="dialog" aria-labelledby="likeModalCenterTitle" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content modal-likes-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body modal-likes-body">
							</div>
						</div>
					</div>
				</div>
				<div className="modal fade" id="commentModalCenter" tabindex="-1" role="dialog" aria-labelledby="commentModalCenterTitle" aria-hidden="true">
					<div className="modal-dialog modal-dialog-centered" role="document">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
							</div>
							<div className="modal-body modal-comment-body">
							</div>
							<div className="comment-input-box">
								<form onSubmit={this.submitComment}>
									<input placeholder="Add Comment" type="text" value={this.state.comment} onChange={this.inputCommentChange}></input>
									<button>Submit</button>
								</form>
							</div>
						</div>
					</div>
				</div>
				<InfiniteScroll
					dataLength={this.state.posts.length} //This is important field to render the next data
					next={this.fetchMoreData}
					hasMore={this.state.morePosts}
					loader={<h4 style={{marginTop:'10px'}}><CircularProgress />
						<CircularProgress color="secondary" />
					</h4>}
					endMessage={
						<p style={{ textAlign: 'center', marginTop:'10px' }}>
							<b>Yay! You have seen it all</b>
						</p>
					}
				>
					{this.state.posts.map(post => (
						<Card >
							<CardHeader
								avatar={
									<Avatar aria-label="recipe" className="avatar">{post.user.name.charAt(0).toUpperCase()}</Avatar>
								}
								action={
									<IconButton aria-label="settings">
										<MoreVertIcon />
									</IconButton>
								}
								title={post.user.name}
								subheader={post.created}
							/>
							{post.upload ? (
								<CardMedia
									className="media"
									image={post.upload.url}
									title="Paella dish"
								/>
							) : (
									<div></div>
								)}
							<CardContent>
								<Typography variant="body2" color="textSecondary" component="p">
									{post.text}
								</Typography>
							</CardContent>
							<CardActions disableSpacing>
								<Like userId={this.props.userId} likes={post.likes} postId={post._id} />
								<div onClick={() => this.clickComment(post._id)}>
									<h6 className="comment-text" data-toggle="modal" data-target="#commentModalCenter">Comment</h6>
								</div>
							</CardActions>
						</Card>
					))}
				</InfiniteScroll>
			</div>
		)
	}
}

export default Posts;
