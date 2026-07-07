import { gql } from "@apollo/client";

const postFields = `
  id
  title
  slug
  excerpt
  content
  authorName
  category
  featuredImage
  tags
  visibility
  status
  publishDate
  createdAt
  updatedAt
`;

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      ${postFields}
    }
  }
`;

export const SEARCH_POSTS = gql`
  query SearchPosts($query: String!) {
    searchPosts(query: $query) {
      ${postFields}
    }
  }
`;

export const GET_DRAFTS = gql`
  query GetDrafts {
    drafts {
      ${postFields}
    }
  }
`;

export const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      ${postFields}
    }
  }
`;

export const ADD_POST = gql`
  mutation AddPost($input: PostInput!) {
    addPost(input: $input) {
      ${postFields}
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: PostInput!) {
    updatePost(id: $id, input: $input) {
      ${postFields}
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;
