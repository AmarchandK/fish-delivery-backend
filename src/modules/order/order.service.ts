import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Order, OrderStatus, PaymentStatus } from '../../entities/order.entity';
import { OrderItem } from '../../entities/order-item.entity';
import { CreateFish } from '../../entities/create_fish.entity';
import { User } from '../../entities/user.entity';
import { UserAddress } from '../../entities/user_address_entity';
import { CreateOrderDto, OrderItemDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { errorResponse, successResponse } from '../../common/responses';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(CreateFish)
    private fishRepository: Repository<CreateFish>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserAddress)
    private userAddressRepository: Repository<UserAddress>,
  ) {}

  async createOrder(userId: number, createOrderDto: CreateOrderDto) {
    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Verify user exists
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Verify shipping address
      const shippingAddress = await this.userAddressRepository.findOne({
        where: {
          id: createOrderDto.shippingAddressId,
          user_id: userId.toString(),
        },
      });
      if (!shippingAddress) {
        throw new NotFoundException('Shipping address not found');
      }

      // Get all fish items in one query
      const fishIds = createOrderDto.items.map((item) => item.fishId);
      const fishes = await this.fishRepository.find({
        where: { id: In(fishIds) },
      });

      if (fishes.length !== fishIds.length) {
        throw new NotFoundException('One or more fish items not found');
      }

      const fishMap = new Map(fishes.map((fish) => [fish.id, fish]));
      const orderItems: OrderItem[] = [];
      let subtotal = 0;

      // Create order items and calculate subtotal
      for (const item of createOrderDto.items) {
        const fish = fishMap.get(item.fishId);
        if (!fish) continue;

        const itemTotal = fish.price * item.quantity;
        subtotal += itemTotal;

        const orderItem = new OrderItem();
        orderItem.fish = fish;
        orderItem.quantity = item.quantity;
        orderItem.price = fish.price;
        orderItem.total = itemTotal;
        orderItem.name = fish.name;
        orderItem.image = fish.productImages?.[0]?.image || ''; // Ensure image is a string

        orderItems.push(orderItem);
      }

      // Calculate total
      const tax = createOrderDto.tax || 0;
      const shippingCharge = createOrderDto.shippingCharge || 0;
      const total = subtotal + tax + shippingCharge;

      // Create order
      const order = this.orderRepository.create({
        user: { id: userId },
        shippingAddress: { id: createOrderDto.shippingAddressId },
        subtotal,
        tax,
        shippingCharge,
        total,
        paymentMethod: createOrderDto.paymentMethod || 'COD',
        notes: createOrderDto.notes,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
      });

      order.generateOrderNumber();
      const savedOrder = await queryRunner.manager.save(order);

      // Save order items with order ID
      const savedItems = await Promise.all(
        orderItems.map((item) =>
          queryRunner.manager.save(OrderItem, { ...item, order: savedOrder }),
        ),
      );

      await queryRunner.commitTransaction();

      // Fetch the complete order with relations
      const completeOrder = await this.orderRepository.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'shippingAddress'],
      });

      return successResponse(completeOrder, 'Order created successfully', 201);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error creating order:', error);
      return errorResponse(
        error,
        error.message || 'Error creating order',
        error.status || 500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getOrderById(id: string, userId: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id, userId },
        relations: ['items', 'shippingAddress'],
      });

      if (!order) {
        return errorResponse(null, 'Order not found', 404);
      }

      return successResponse(order, 'Order fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching order:', error);
      return errorResponse(error, 'Error fetching order', 500);
    }
  }

  async getUserOrders(userId: number) {
    try {
      const orders = await this.orderRepository.find({
        where: { user: { id: userId } },
        relations: ['items'],
        order: { createdAt: 'DESC' },
      });

      return successResponse(orders, 'Orders fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return errorResponse(error, 'Error fetching orders', 500);
    }
  }

  async updateOrder(
    id: string,
    updateOrderDto: UpdateOrderDto,
    userId?: string,
  ) {
    const queryRunner =
      this.orderRepository.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const where: any = { id };
      if (userId) {
        where.user = { id: userId };
      }

      const order = await this.orderRepository.findOne({ where });
      if (!order) {
        throw new NotFoundException('Order not found');
      }

      // Update order fields
      if (updateOrderDto.status) {
        order.status = updateOrderDto.status;

        // Update timestamps based on status
        if (updateOrderDto.status === OrderStatus.DELIVERED) {
          order.deliveredAt = new Date();
        } else if (updateOrderDto.status === OrderStatus.CANCELLED) {
          order.cancelledAt = new Date();
          order.cancellationReason = updateOrderDto.cancellationReason ?? '';
        }
      }

      if (updateOrderDto.paymentStatus) {
        order.paymentStatus = updateOrderDto.paymentStatus;
      }

      if (updateOrderDto.paymentId) {
        order.paymentId = updateOrderDto.paymentId;
      }

      if (updateOrderDto.transactionId) {
        order.transactionId = updateOrderDto.transactionId;
      }

      if (updateOrderDto.cancellationReason) {
        order.cancellationReason = updateOrderDto.cancellationReason;
      }

      const updatedOrder = await queryRunner.manager.save(Order, order);
      await queryRunner.commitTransaction();

      return successResponse(updatedOrder, 'Order updated successfully', 200);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error('Error updating order:', error);
      return errorResponse(
        error,
        error.message || 'Error updating order',
        error.status || 500,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async cancelOrder(orderId: string, reason: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        return errorResponse(null, 'Order not found', 404);
      }

      // Check if order can be cancelled
      if (
        [
          OrderStatus.CANCELLED,
          OrderStatus.DELIVERED,
          OrderStatus.SHIPPED,
        ].includes(order.status)
      ) {
        return errorResponse(
          null,
          `Order cannot be cancelled as it is already ${order.status.toLowerCase()}`,
          400,
        );
      }

      // Update order status to cancelled
      const result = await this.updateOrder(orderId, {
        status: OrderStatus.CANCELLED,
        cancellationReason: reason,
        paymentStatus: this.shouldRefund(order.paymentStatus)
          ? PaymentStatus.REFUNDED
          : order.paymentStatus,
      });

      return result;
    } catch (error) {
      console.error('Error cancelling order:', error);
      return errorResponse(error, 'Error cancelling order', 500);
    }
  }

  async getOrderHistory(userId: string) {
    try {
      const orders = await this.orderRepository.find({
        where: { userId },
        relations: ['items', 'shippingAddress'],
        order: { createdAt: 'DESC' },
      });

      return successResponse(orders, 'Order history fetched successfully', 200);
    } catch (error) {
      console.error('Error fetching order history:', error);
      return errorResponse(error, 'Error fetching order history', 500);
    }
  }
  async getAllOrders(arg0: {
    status: string | undefined;
    page: number;
    limit: number;
  }) {
    throw new Error('Method not implemented.');
  }
  async deleteOrder(id: string) {
    try {
      const order = await this.orderRepository.findOne({
        where: { id },
      });

      if (!order) {
        return errorResponse(null, 'Order not found', 404);
      }

      await this.orderRepository.remove(order);

      return successResponse(null, 'Order deleted successfully', 200);
    } catch (error) {
      console.error('Error deleting order:', error);
      return errorResponse(error, 'Error deleting order', 500);
    }
  }

  private shouldRefund(paymentStatus: PaymentStatus): boolean {
    return [PaymentStatus.COMPLETED, PaymentStatus.PARTIALLY_REFUNDED].includes(
      paymentStatus,
    );
  }
}
