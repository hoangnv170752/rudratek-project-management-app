import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Project, ProjectStatus } from '../types';
import { projectService, PaginationInfo } from '../services/api';
import {
  ProjectCard,
  StatusFilter,
  SearchBar,
  EmptyState,
  ErrorState,
  LoadingState,
} from '../components';
import { RootStackParamList } from '@/navigation/types';

type FilterOption = ProjectStatus | 'all';

const PAGE_SIZE = 10;

interface ProjectListScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProjectList'>;
}

export const ProjectListScreen: React.FC<ProjectListScreenProps> = ({ navigation }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterOption>('all');
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);

  const fetchProjects = useCallback(async (page = 1, append = false) => {
    try {
      setError(null);
      if (page === 1 && !append) {
        setLoading(true);
      }
      const response = await projectService.getAll({
        page,
        limit: PAGE_SIZE,
        status: statusFilter === 'all' ? undefined : statusFilter,
        search: searchQuery || undefined,
      });
      if (append) {
        setProjects((prev) => [...prev, ...response.data]);
      } else {
        setProjects(response.data);
      }
      setPagination(response.pagination);
    } catch (err) {
      setError('Failed to load projects. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchProjects(1, false);
  }, [fetchProjects]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects(1, false);
  }, [fetchProjects]);

  const handleLoadMore = useCallback(() => {
    if (loadingMore || !pagination?.hasMore) return;
    setLoadingMore(true);
    fetchProjects(pagination.page + 1, true);
  }, [loadingMore, pagination, fetchProjects]);

  const handleProjectPress = useCallback(
    (project: Project) => {
      navigation.navigate('ProjectDetail', { projectId: project.id });
    },
    [navigation]
  );

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#007AFF" />
      </View>
    );
  };

  if (loading) {
    return <LoadingState message="Loading projects..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => fetchProjects(1, false)} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <StatusFilter selectedStatus={statusFilter} onStatusChange={setStatusFilter} />
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} onPress={handleProjectPress} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        contentContainerStyle={projects.length === 0 ? styles.emptyList : styles.list}
        ListEmptyComponent={
          <EmptyState
            title="No Projects"
            message="No projects match your criteria."
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    paddingBottom: 100,
  },
  emptyList: {
    flex: 1,
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});
