/**
 * Tests for Checklist Controller
 *
 * Test Coverage:
 * 1. GET /api/checklist (list)
 * 2. POST /api/checklist (create)
 * 3. PUT /api/checklist/:id (update)
 * 4. DELETE /api/checklist/:id (delete)
 * 5. Authentication
 * 6. Validation
 * 7. Authorization (user can only access their own items)
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import * as checklistController from '../checklistController';

// Mock database
vi.mock('../../models/prisma', () => ({
  prisma: {
    checklistItem: {
      findMany: vi.fn(),
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  shouldUsePrisma: vi.fn(() => true),
}));

vi.mock('../../models/db', () => ({
  db: {
    prepare: vi.fn(() => ({
      get: vi.fn(),
      all: vi.fn(),
      run: vi.fn(),
    })),
  },
}));

vi.mock('../../utils/prismaSerialization', () => ({
  jsonSafe: (obj: any) => obj,
}));

import { prisma } from '../../models/prisma';

describe('Checklist Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let jsonMock: ReturnType<typeof vi.fn>;
  let statusMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();

    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });

    mockRequest = {
      user: { id: 1 },
      query: {},
      body: {},
      params: {},
    };

    mockResponse = {
      json: jsonMock,
      status: statusMock,
    };
  });

  describe('listChecklistItems', () => {
    it('should list all checklist items', async () => {
      const mockItems = [
        {
          id: BigInt(1),
          userId: BigInt(1),
          text: 'Task 1',
          checked: false,
          link: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: BigInt(2),
          userId: BigInt(1),
          text: 'Task 2',
          checked: true,
          link: 'https://example.com',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      vi.mocked(prisma.checklistItem.findMany).mockResolvedValue(mockItems);

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            id: '1',
            text: 'Task 1',
            checked: false,
            link: undefined,
          },
          {
            id: '2',
            text: 'Task 2',
            checked: true,
            link: 'https://example.com',
          },
        ],
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized',
      });
    });

    it('should filter by completed status', async () => {
      mockRequest.query = { status: 'completed' };

      vi.mocked(prisma.checklistItem.findMany).mockResolvedValue([
        {
          id: BigInt(2),
          userId: BigInt(1),
          text: 'Task 2',
          checked: true,
          link: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.checklistItem.findMany).toHaveBeenCalledWith({
        where: {
          userId: BigInt(1),
          checked: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [
          {
            id: '2',
            text: 'Task 2',
            checked: true,
            link: undefined,
          },
        ],
      });
    });

    it('should filter by pending status', async () => {
      mockRequest.query = { status: 'pending' };

      vi.mocked(prisma.checklistItem.findMany).mockResolvedValue([
        {
          id: BigInt(1),
          userId: BigInt(1),
          text: 'Task 1',
          checked: false,
          link: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.checklistItem.findMany).toHaveBeenCalledWith({
        where: {
          userId: BigInt(1),
          checked: false,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
    });

    it('should return empty array if no items', async () => {
      vi.mocked(prisma.checklistItem.findMany).mockResolvedValue([]);

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: [],
      });
    });

    it('should handle database errors', async () => {
      vi.mocked(prisma.checklistItem.findMany).mockRejectedValue(
        new Error('Database error')
      );

      await checklistController.listChecklistItems(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to list checklist items',
      });
    });
  });

  describe('createChecklistItem', () => {
    it('should create a new checklist item', async () => {
      mockRequest.body = {
        text: 'New Task',
        link: 'https://example.com',
      };

      const mockItem = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'New Task',
        checked: false,
        link: 'https://example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.checklistItem.create).mockResolvedValue(mockItem);

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: '1',
          text: 'New Task',
          checked: false,
          link: 'https://example.com',
        },
      });
    });

    it('should create item without link', async () => {
      mockRequest.body = {
        text: 'New Task',
      };

      const mockItem = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'New Task',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.checklistItem.create).mockResolvedValue(mockItem);

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: '1',
          text: 'New Task',
          checked: false,
          link: undefined,
        },
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      mockRequest.body = { text: 'New Task' };

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Unauthorized',
      });
    });

    it('should return 400 if text is missing', async () => {
      mockRequest.body = {};

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Text is required and must be a non-empty string',
      });
    });

    it('should return 400 if text is empty', async () => {
      mockRequest.body = { text: '   ' };

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Text is required and must be a non-empty string',
      });
    });

    it('should return 400 if link is invalid type', async () => {
      mockRequest.body = { text: 'Task', link: 123 };

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Link must be a string',
      });
    });

    it('should trim whitespace from text', async () => {
      mockRequest.body = { text: '  Task with spaces  ' };

      const mockItem = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'Task with spaces',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.checklistItem.create).mockResolvedValue(mockItem);

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.checklistItem.create).toHaveBeenCalledWith({
        data: {
          userId: BigInt(1),
          text: 'Task with spaces',
          link: null,
        },
      });
    });

    it('should handle database errors', async () => {
      mockRequest.body = { text: 'New Task' };

      vi.mocked(prisma.checklistItem.create).mockRejectedValue(
        new Error('Database error')
      );

      await checklistController.createChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Failed to create checklist item',
      });
    });
  });

  describe('updateChecklistItem', () => {
    it('should update checklist item', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { checked: true };

      const mockExisting = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'Task',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdated = {
        ...mockExisting,
        checked: true,
      };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(mockExisting);
      vi.mocked(prisma.checklistItem.update).mockResolvedValue(mockUpdated);

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: '1',
          text: 'Task',
          checked: true,
          link: undefined,
        },
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      mockRequest.params = { id: '1' };
      mockRequest.body = { checked: true };

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should return 404 if item not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { checked: true };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(null);

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Checklist item not found',
      });
    });

    it('should return 404 if item belongs to different user', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { checked: true };
      mockRequest.user = { id: 2 }; // Different user

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(null);

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should return 400 if no valid fields to update', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = {};

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'No valid fields to update',
      });
    });

    it('should update text field', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { text: 'Updated Task' };

      const mockExisting = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'Original Task',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdated = {
        ...mockExisting,
        text: 'Updated Task',
      };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(mockExisting);
      vi.mocked(prisma.checklistItem.update).mockResolvedValue(mockUpdated);

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(prisma.checklistItem.update).toHaveBeenCalledWith({
        where: { id: BigInt(1) },
        data: {
          text: 'Updated Task',
          updatedAt: expect.any(Date),
        },
      });
    });

    it('should update link field', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { link: 'https://new-link.com' };

      const mockExisting = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'Task',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockUpdated = {
        ...mockExisting,
        link: 'https://new-link.com',
      };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(mockExisting);
      vi.mocked(prisma.checklistItem.update).mockResolvedValue(mockUpdated);

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: '1',
          text: 'Task',
          checked: false,
          link: 'https://new-link.com',
        },
      });
    });

    it('should handle database errors', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.body = { checked: true };

      vi.mocked(prisma.checklistItem.findFirst).mockRejectedValue(
        new Error('Database error')
      );

      await checklistController.updateChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteChecklistItem', () => {
    it('should delete checklist item', async () => {
      mockRequest.params = { id: '1' };

      const mockExisting = {
        id: BigInt(1),
        userId: BigInt(1),
        text: 'Task',
        checked: false,
        link: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(mockExisting);
      vi.mocked(prisma.checklistItem.delete).mockResolvedValue(mockExisting);

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        data: {
          id: '1',
        },
      });
    });

    it('should return 401 if user is not authenticated', async () => {
      mockRequest.user = undefined;
      mockRequest.params = { id: '1' };

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(401);
    });

    it('should return 404 if item not found', async () => {
      mockRequest.params = { id: '999' };

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(null);

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Checklist item not found',
      });
    });

    it('should return 404 if item belongs to different user', async () => {
      mockRequest.params = { id: '1' };
      mockRequest.user = { id: 2 }; // Different user

      vi.mocked(prisma.checklistItem.findFirst).mockResolvedValue(null);

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it('should return 400 if ID is missing', async () => {
      mockRequest.params = {};

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        error: 'Item ID is required',
      });
    });

    it('should handle database errors', async () => {
      mockRequest.params = { id: '1' };

      vi.mocked(prisma.checklistItem.findFirst).mockRejectedValue(
        new Error('Database error')
      );

      await checklistController.deleteChecklistItem(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(statusMock).toHaveBeenCalledWith(500);
    });
  });
});
