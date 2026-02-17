import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Project, ProjectStatus } from '../types';

interface ProjectCardProps {
  project: Project;
  onPress: (project: Project) => void;
}

const getStatusColor = (status: ProjectStatus): string => {
  switch (status) {
    case 'active':
      return '#4CAF50';
    case 'on_hold':
      return '#FF9800';
    case 'completed':
      return '#2196F3';
    default:
      return '#9E9E9E';
  }
};

const formatStatus = (status: ProjectStatus): string => {
  return status.replace('_', ' ').toUpperCase();
};

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(project)}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>
          {project.name}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(project.status) }]}>
          <Text style={styles.statusText}>{formatStatus(project.status)}</Text>
        </View>
      </View>
      <Text style={styles.client} numberOfLines={1}>
        {project.clientName}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#fff',
  },
  client: {
    fontSize: 14,
    color: '#666',
  },
});
