import { ApolloError, DocumentNode, useQuery } from "@apollo/client";
import { useCallback, useEffect, useRef, useState } from "react";

export function usePaginationQuery<T>(query: DocumentNode, key: string, pageSize: number = 100, pageNumber: number = 0) {
  const [list, setList] = useState([] as T[])
  const [hasMore, setHasMore] = useState(true)
  const { loading, error, data } = useQuery(query, {
    variables: { offset: (pageNumber * pageSize), limit: pageSize },
  });

  const setPaginationData = () => {
    if(!data) return;
    const dataList = data[key];
    setList((prevData: T[]) => [...prevData, ...dataList])
    setHasMore(dataList.length > 0)
  }

  useEffect(() => {
    setPaginationData();
  }, [data])

  return ([list, loading, error, hasMore] as [T[], boolean, ApolloError, boolean]);
}

export function usePaginationDetection(loading: boolean, hasMore: boolean, setPageNumber: any) {
  const observer: any = useRef()
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPageNumber((prevPageNumber: number) => prevPageNumber + 1)
      }
    });
    if (node) {
      observer.current.observe(node)
    }
  }, [loading, hasMore])

  return [lastElementRef]
}