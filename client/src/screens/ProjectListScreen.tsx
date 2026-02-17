import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { StyleSheet, View, FlatList, RefreshControl } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Project, ProjectStatus } from '../types';
import { projectService } from '../services/api';
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

interface ProjectListScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProjectList'>;
}

export const ProjectListScreen: React.FC<ProjectListScreenProps> = ({ navigation }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterOption>('all');

  const fetchProjects = useCallback(async () => {
    try {
      setError(null);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (err) {
      setError('Failed to load projects. Please check your connection.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectPress = useCallback(
    (project: Project) => {
      navigation.navigate('ProjectDetail', { projectId: project.id });
    },
    [navigation]
  );

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === '' ||
        project.name.toLowerCase().includes(searchLower) ||
        project.clientName.toLowerCase().includes(searchLower);
      return matchesStatus && matchesSearch;
    });
  }, [projects, statusFilter, searchQuery]);

  if (loading) {
    return <LoadingState message="Loading projects..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchProjects} />;
  }

  return (
    <View style={styles.container}>
      <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
      <StatusFilter selectedStatus={statusFilter} onStatusChange={setStatusFilter} />
      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProjectCard project={item} onPress={handleProjectPress} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        contentContainerStyle={filteredProjects.length === 0 ? styles.emptyList : undefined}
        ListEmptyComponent={
          projects.length === 0 ? (
            <EmptyState
              title="No Projects"
              message="There are no projects to display."
            />
          ) : (
            <EmptyState
              title="No Results"
              message="No projects match your search or filter criteria."
            />
          )
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
  emptyList: {
    flex: 1,
  },
});
