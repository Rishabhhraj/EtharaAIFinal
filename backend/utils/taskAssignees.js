import User from '../models/User.js';
import { toIdString } from './projectAccess.js';

export const normalizeAssigneeInput = (body) => {
  if (Array.isArray(body.assigneeIds)) {
    return [...new Set(body.assigneeIds.filter(Boolean).map((id) => id.toString()))];
  }
  if (body.assignedTo) {
    return [body.assignedTo.toString()];
  }
  return [];
};

export const getTaskAssigneeIds = (task) => {
  if (task.assignees?.length) {
    return task.assignees.map((a) => toIdString(a));
  }
  if (task.assignedTo) {
    return [toIdString(task.assignedTo)];
  }
  return [];
};

export const userIsTaskAssignee = (task, userId) =>
  getTaskAssigneeIds(task).includes(toIdString(userId));

export const syncPrimaryAssignee = (task) => {
  const ids = getTaskAssigneeIds(task);
  task.assignees = ids;
  task.assignedTo = ids[0] || null;
};

export const validateProjectAssignees = async (project, assigneeIds) => {
  if (!assigneeIds.length) return [];

  const validated = [];
  for (const assigneeId of assigneeIds) {
    const assignee = await User.findById(assigneeId);
    if (!assignee) {
      throw new Error('One or more assignees were not found');
    }
    const isOnTeam =
      project.members.some((m) => toIdString(m) === assigneeId) ||
      toIdString(project.createdBy) === assigneeId;
    if (!isOnTeam && assignee.role === 'member') {
      throw new Error('All assignees must be members of this project');
    }
    validated.push(assigneeId);
  }
  return validated;
};
