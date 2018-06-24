package tmalltest.DAO;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import tmalltest.bean.Order;
import tmalltest.bean.OrderItem;
import tmalltest.bean.Product;
import tmalltest.bean.User;

public class OrderItemDAO {
	public int getTotal() {
        int total = 0;
        try (Connection c = DBUtil.getConnection(); Statement s = c.createStatement();) {
  
            String sql = "select count(*) from OrderItem";
  
            ResultSet rs = s.executeQuery(sql);
            while (rs.next()) {
                total = rs.getInt(1);
            }
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
        return total;
    }
  
    public void add(OrderItem bean) {
 
        String sql = "insert into OrderItem values(null,?,?,?,?)";
        try (Connection c = DBUtil.getConnection(); PreparedStatement ps = c.prepareStatement(sql);) {
  
            ps.setInt(1, bean.getProduct().getId());
             
            //订单项在创建的时候，是没有蒂订单信息的
            if(null==bean.getOrder())
                ps.setInt(2, -1);
            else
                ps.setInt(2, bean.getOrder().getId()); 
             
            ps.setInt(3, bean.getUser().getId());
            ps.setInt(4, bean.getNumber());
            ps.execute();
  
            ResultSet rs = ps.getGeneratedKeys();
            if (rs.next()) {
                int id = rs.getInt(1);
                bean.setId(id);
            }
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
    }
  
    public void update(OrderItem bean) {
 
        String sql = "update OrderItem set pid= ?, oid=?, uid=?,number=?  where id = ?";
        try (Connection c = DBUtil.getConnection(); PreparedStatement ps = c.prepareStatement(sql);) {
 
            ps.setInt(1, bean.getProduct().getId());
            if(null==bean.getOrder())
                ps.setInt(2, -1);
            else
                ps.setInt(2, bean.getOrder().getId());             
            ps.setInt(3, bean.getUser().getId());
            ps.setInt(4, bean.getNumber());
             
            ps.setInt(5, bean.getId());
            ps.execute();
  
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
  
    }
  
    public void delete(int id) {
  
        try (Connection c = DBUtil.getConnection(); Statement s = c.createStatement();) {
  
            String sql = "delete from OrderItem where id = " + id;
  
            s.execute(sql);
  
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
    }
    
    public OrderItem get(int id) {
    	OrderItem bean = new OrderItem();
    	try(Connection c = DBUtil.getConnection();Statement s = c.createStatement()) {
			String sql = "select * from orderItem where id ="+id;
			ResultSet rs = s.executeQuery(sql);
			while(rs.next()) {
				int pid = rs.getInt("pid");
                int oid = rs.getInt("oid");
                int uid = rs.getInt("uid");
                int number = rs.getInt("number");
                Product product = new ProductDAO().get(pid);
                User user = new UserDAO().get(uid);
                bean.setProduct(product);
                bean.setUser(user);
                bean.setNumber(number);
                
                if(-1!=oid) {
                	Order order = new OrderDAO().get(oid);
                	bean.setOrder(order);
                }
                bean.setId(id);
                
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
    	return bean;
    }
    //购物车中的订单项 ，oid = -1 表示 未生成订单项
    public List<OrderItem> listByUser(int uid) {
        return listByUser(uid, 0, Short.MAX_VALUE);
    }
  
    public List<OrderItem> listByUser(int uid, int start, int count) {
        List<OrderItem> beans = new ArrayList<OrderItem>();
  
        String sql = "select * from OrderItem where uid = ? and oid=-1 order by id desc limit ?,? ";
  
        try (Connection c = DBUtil.getConnection(); PreparedStatement ps = c.prepareStatement(sql);) {
  
            ps.setInt(1, uid);
            ps.setInt(2, start);
            ps.setInt(3, count);
  
            ResultSet rs = ps.executeQuery();
  
            while (rs.next()) {
                OrderItem bean = new OrderItem();
                int id = rs.getInt(1);
 
                int pid = rs.getInt("pid");
                int oid = rs.getInt("oid");
                int number = rs.getInt("number");
                 
                Product product = new ProductDAO().get(pid);
                if(-1!=oid){
                    Order order= new OrderDAO().get(oid);
                    bean.setOrder(order);                  
                }
 
                User user = new UserDAO().get(uid);
                bean.setProduct(product);
 
                bean.setUser(user);
                bean.setNumber(number);
                bean.setId(id);               
                beans.add(bean);
            }
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
        return beans;
    }
    //某订单下所有的订单项
    public List<OrderItem> listByOrder(int oid) {
        return listByOrder(oid, 0, Short.MAX_VALUE);
    }
     
    public List<OrderItem> listByOrder(int oid, int start, int count) {
        List<OrderItem> beans = new ArrayList<OrderItem>();
         
        String sql = "select * from OrderItem where oid = ? order by id desc limit ?,? ";
         
        try (Connection c = DBUtil.getConnection(); PreparedStatement ps = c.prepareStatement(sql);) {
             
            ps.setInt(1, oid);
            ps.setInt(2, start);
            ps.setInt(3, count);
             
            ResultSet rs = ps.executeQuery();
             
            while (rs.next()) {
                OrderItem bean = new OrderItem();
                int id = rs.getInt(1);
                 
                int pid = rs.getInt("pid");
                int uid = rs.getInt("uid");
                int number = rs.getInt("number");
                 
                Product product = new ProductDAO().get(pid);
                if(-1!=oid){
                    Order order= new OrderDAO().get(oid);
                    bean.setOrder(order);                  
                }
                 
                User user = new UserDAO().get(uid);
                bean.setProduct(product);
                 
                bean.setUser(user);
                bean.setNumber(number);
                bean.setId(id);               
                beans.add(bean);
            }
        } catch (SQLException e) {
             
            e.printStackTrace();
        }
        return beans;
    }
    

    /*获取该用户当前购物所有的订单（一个订单代表一种商品），再获取每一个订单下中含有的订单项（即该商品的数量），
     初始化订单的价格，数量，把每一个订单项的价格加上，生成总金额，和总数。*/
    public void fill(List<Order> os) {
        for (Order o : os) {
            List<OrderItem> ois=listByOrder(o.getId());
            float total = 0;
            int totalNumber = 0;
            for (OrderItem oi : ois) {
                 total+=oi.getNumber()*oi.getProduct().getPromotePrice();
                 totalNumber+=oi.getNumber();
            }
            o.setTotal(total);
            o.setOrderItems(ois);
            o.setTotalNumber(totalNumber);
        }
         
    }
 
    //意思是几个相同的商品 的价格。
    public void fill(Order o) {
        List<OrderItem> ois=listByOrder(o.getId());
        float total = 0;
        for (OrderItem oi : ois) {
             total+=oi.getNumber()*oi.getProduct().getPromotePrice();
        }
        o.setTotal(total);
        o.setOrderItems(ois);
    }
    
    
    //获取有该商品的订单
    public List<OrderItem> listByProduct(int pid) {
        return listByProduct(pid, 0, Short.MAX_VALUE);
    }
  
    public List<OrderItem> listByProduct(int pid, int start, int count) {
        List<OrderItem> beans = new ArrayList<OrderItem>();
  
        String sql = "select * from OrderItem where pid = ? order by id desc limit ?,? ";
  
        try (Connection c = DBUtil.getConnection(); PreparedStatement ps = c.prepareStatement(sql);) {
  
            ps.setInt(1, pid);
            ps.setInt(2, start);
            ps.setInt(3, count);
  
            ResultSet rs = ps.executeQuery();
  
            while (rs.next()) {
                OrderItem bean = new OrderItem();
                int id = rs.getInt(1);
 
                int uid = rs.getInt("uid");
                int oid = rs.getInt("oid");
                int number = rs.getInt("number");
                 
                Product product = new ProductDAO().get(pid);
                if(-1!=oid){
                    Order order= new OrderDAO().get(oid);
                    bean.setOrder(order);                  
                }
 
                User user = new UserDAO().get(uid);
                bean.setProduct(product);
 
                bean.setUser(user);
                bean.setNumber(number);
                bean.setId(id);               
                beans.add(bean);
            }
        } catch (SQLException e) {
  
            e.printStackTrace();
        }
        return beans;
    }
 
    //获取某个商品的订单量
    public int getSaleCount(int pid) {
         int total = 0;
            try (Connection c = DBUtil.getConnection(); Statement s = c.createStatement();) {
      
                String sql = "select sum(number) from OrderItem where pid = " + pid;
      
                ResultSet rs = s.executeQuery(sql);
                while (rs.next()) {
                    total = rs.getInt(1);
                }
            } catch (SQLException e) {
      
                e.printStackTrace();
            }
            return total;
    }
}
