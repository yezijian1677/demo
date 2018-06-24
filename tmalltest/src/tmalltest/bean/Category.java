package tmalltest.bean;

import java.util.List;

public class Category {
	private int id;
	private String name;
	List<Product> products;//�����б�
	List<List<Product>> productsByRow;//�����б�����Ӧ����Ԫ��
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public List<Product> getProducts() {
		return products;
	}
	public void setProducts(List<Product> products) {
		this.products = products;
	}
	public List<List<Product>> getProductsByRow() {
		return productsByRow;
	}
	public void setProductsByRow(List<List<Product>> productsByRow) {
		this.productsByRow = productsByRow;
	}
	
	@Override
	public String toString() {
		return "Category[name="+name+"]";
	}

}
