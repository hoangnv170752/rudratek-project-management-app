import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Project, ProjectStatus } from '../types';
import { projectService } from '../services/api';
import { LoadingState, ErrorState } from '../components';
import { RootStackParamList } from '../navigation/types';

interface ProjectDetailScreenProps {
  navigation: NativeStackNavigationProp<RootStackParamList, 'ProjectDetail'>;
  route: RouteProp<RootStackParamList, 'ProjectDetail'>;
}

const statusOptions: { value: ProjectStatus; label: string; color: string }[] = [
  { value: 'active', label: 'Active', color: '#4CAF50' },
  { value: 'on_hold', label: 'On Hold', color: '#FF9800' },
  { value: 'completed', label: 'Completed', color: '#2196F3' },
];

export const ProjectDetailScreen: React.FC<ProjectDetailScreenProps> = ({
  navigation,
  route,
}) => {
  const { projectId } = route.params;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProject = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await projectService.getById(projectId);
      setProject(data);
    } catch (err) {
      setError('Failed to load project details.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleStatusChange = useCallback(
    async (newStatus: ProjectStatus) => {
      if (!project || project.status === newStatus) return;

      setUpdating(true);
      try {
        const updatedProject = await projectService.updateStatus(projectId, newStatus);
        setProject(updatedProject);
        Alert.alert('Success', 'Project status updated successfully.');
      } catch (err) {
        Alert.alert('Error', 'Failed to update project status.');
      } finally {
        setUpdating(false);
      }
    },
    [project, projectId]
  );

  if (loading) {
    return <LoadingState message="Loading project details..." />;
  }

  if (error || !project) {
    return <ErrorState message={error || 'Project not found.'} onRetry={fetchProject} />;
  }

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.name}>{project.name}</Text>
        <Text style={styles.client}>{project.clientName}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timeline</Text>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Start Date:</Text>
            <Text style={styles.dateValue}>{formatDate(project.startDate)}</Text>
          </View>
          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>End Date:</Text>
            <Text style={styles.dateValue}>{formatDate(project.endDate)}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Status</Text>
          <View style={styles.statusButtons}>
            {statusOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.statusButton,
                  { borderColor: option.color },
                  project.status === option.value && { backgroundColor: option.color },
                ]}
                onPress={() => handleStatusChange(option.value)}
                disabled={updating}
              >
                <Text
                  style={[
                    styles.statusButtonText,
                    { color: project.status === option.value ? '#fff' : option.color },
                  ]}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  client: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
  },
  dateRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    width: 90,
  },
  dateValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statusButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
