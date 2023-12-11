import GridPostList from '@/components/shared/GridPostList';
import { Models } from 'appwrite';
import { Loader } from 'lucide-react';


type SearchResultsProps = {
  isSearchFetching: boolean
  searchedPosts: Models.Document[];
}

const SearchResults = ({isSearchFetching, searchedPosts} : SearchResultsProps) => {
  if(isSearchFetching) return <Loader/>

  if(searchedPosts && searchedPosts.documents.length > 0) {
    return (
      <GridPostList posts={searchedPosts.documents} />
    )
  }

  return (
    <p className='text-light-4 mt-10 text-center w-full'>No Results found</p>
  )
}

export default SearchResults