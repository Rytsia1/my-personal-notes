import { useState } from 'react';

const useFilters = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [statusFilter, setStatusFilter] = useState('all');

  return {
    searchKeyword,
    setSearchKeyword,
    selectedTag,
    setSelectedTag,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
  };
};

export default useFilters;
