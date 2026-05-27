import Task from '../models/Task.js';
import Project from '../models/Project.js';
import { userCanAccessProject, userIsProjectAdmin } from '../utils/projectAccess.js';
import { rejectIfArchived } from '../utils/projectArchived.js';
import { createNotification } from '../utils/notify.js';
import { sortTasksByPriorityAndDue } from '../utils/taskSort.js';
import {
  normalizeAssigneeInput,
  getTaskAssigneeIds,
  userIsTaskAssignee,
  validateProjectAssignees,
} from '../utils/taskAssignees.js';

const populateTask = (query) =>
  query
    .populate('project', 'name status')
    .populate('assignedTo', 'name email')
    .populate('assignees', 'name email')
    .populate('createdBy', 'name email');

const notifyNewAssignees = async (task, project, assigneeIds, previousIds) => {
  const prev = new Set(previousIds);
  for (const assigneeId of assigneeIds) {
    if (!prev.has(assigneeId)) {
      await createNotification({
        userId: assigneeId,
        message: `You were assigned to task "${task.title}" in ${project.name}`,
        type: 'assigned',
        relatedTask: task._id,
        relatedProject: project._id,
      });
    }
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!userCanAccessProject(project, req.user._id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    let tasks = await populateTask(Task.find({ project: project._id }));
    tasks = sortTasksByPriorityAndDue(tasks);

    res.json({ success: true, count: tasks.length, tasks, projectStatus: project.status });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const createTask = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (!userIsProjectAdmin(project, req.user._id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only admin can create tasks' });
    }
    if (rejectIfArchived(project, res)) return;

    const { title, description, status, dueDate, priority } = req.body;
    const assigneeIds = await validateProjectAssignees(
      project,
      normalizeAssigneeInput(req.body)
    );

    const task = await Task.create({
      title,
      description: description || '',
      project: project._id,
      assignees: assigneeIds,
      assignedTo: assigneeIds[0] || null,
      status: status || 'todo',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdBy: req.user._id,
    });

    if (assigneeIds.length) {
      await notifyNewAssignees(task, project, assigneeIds, []);
    }

    const populated = await populateTask(Task.findById(task._id));
    res.status(201).json({ success: true, task: populated });
  } catch (err) {
    const status = err.message.includes('assignee') ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = task.project;
    if (!userCanAccessProject(project, req.user._id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }
    if (rejectIfArchived(project, res)) return;

    const isAdmin = userIsProjectAdmin(project, req.user._id, req.user.role);
    const isAssignee = userIsTaskAssignee(task, req.user._id);

    const { title, description, status, dueDate, priority } = req.body;
    const previousAssigneeIds = getTaskAssigneeIds(task);
    const hasAssigneeUpdate =
      req.body.assigneeIds !== undefined || req.body.assignedTo !== undefined;

    if (isAdmin) {
      if (title) task.title = title;
      if (description !== undefined) task.description = description;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (priority) task.priority = priority;
      if (hasAssigneeUpdate) {
        const assigneeIds = await validateProjectAssignees(
          project,
          normalizeAssigneeInput(req.body)
        );
        task.assignees = assigneeIds;
        task.assignedTo = assigneeIds[0] || null;
      }
      if (status) task.status = status;
    } else if (isAssignee && status) {
      return res.status(403).json({
        success: false,
        message:
          'Members cannot change task status directly. Submit a status change request for admin approval.',
      });
    } else if (isAssignee) {
      return res.status(403).json({
        success: false,
        message: 'Members cannot update task details. Use status change requests for progress updates.',
      });
    } else {
      return res.status(403).json({ success: false, message: 'Not allowed to update this task' });
    }

    await task.save();

    if (isAdmin && hasAssigneeUpdate) {
      const newAssigneeIds = getTaskAssigneeIds(task);
      const projectDoc = await Project.findById(project._id || project);
      await notifyNewAssignees(task, projectDoc, newAssigneeIds, previousAssigneeIds);
    }

    const populated = await populateTask(Task.findById(task._id));
    res.json({ success: true, task: populated });
  } catch (err) {
    const status = err.message.includes('assignee') ? 400 : 500;
    res.status(status).json({ success: false, message: err.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('project');
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (!userIsProjectAdmin(task.project, req.user._id, req.user.role)) {
      return res.status(403).json({ success: false, message: 'Only admin can delete tasks' });
    }
    if (rejectIfArchived(task.project, res)) return;

    await task.deleteOne();
    res.json({ success: true, message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
