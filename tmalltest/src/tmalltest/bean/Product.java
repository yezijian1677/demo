package tmalltest.bean;

import java.util.Date;
import java.util.List;

public class Product {
	private int id;//��Ʒid
	private String name;//��Ʒ����
	private String subTitle;//��Ʒ����
	private float originPrice;//ԭʼ�۸�
	private float promotePrice;//�����۸�
	private int stock;//���
	private Date createDate;//��������
	private Category category;//������һ������
	private ProductImage firstProductImage;//��ʾ��productSingleImage��ȡ����һ����ΪĬ��ͼƬ
	private List<ProductImage> productImages;
	private List<ProductImage> productSingleImages;//��Ʒ������ʽͼƬ
	private List<ProductImage> productDetailImages;//��Ʒ��������ͼƬ
	private int reviewCount;//������
	private int saleCount;//����
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
	public String getSubTitle() {
		return subTitle;
	}
	public void setSubTitle(String subTitle) {
		this.subTitle = subTitle;
	}
	public float getOriginPrice() {
		return originPrice;
	}
	public void setOriginPrice(float originPrice) {
		this.originPrice = originPrice;
	}
	public float getPromotePrice() {
		return promotePrice;
	}
	public void setPromotePrice(float promotePrice) {
		this.promotePrice = promotePrice;
	}
	public int getStock() {
		return stock;
	}
	public void setStock(int stock) {
		this.stock = stock;
	}
	public Date getCreateDate() {
		return createDate;
	}
	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}
	public Category getCategory() {
		return category;
	}
	public void setCategory(Category category) {
		this.category = category;
	}
	public ProductImage getFirstProductImage() {
		return firstProductImage;
	}
	public void setFirstProductImage(ProductImage firstProductImage) {
		this.firstProductImage = firstProductImage;
	}
	public List<ProductImage> getProductImages() {
		return productImages;
	}
	public void setProductImages(List<ProductImage> productImages) {
		this.productImages = productImages;
	}
	public List<ProductImage> getProductSingleImages() {
		return productSingleImages;
	}
	public void setProductSingleImages(List<ProductImage> productSingleImages) {
		this.productSingleImages = productSingleImages;
	}
	public List<ProductImage> getProductDetailImages() {
		return productDetailImages;
	}
	public void setProductDetailImages(List<ProductImage> productDetailImages) {
		this.productDetailImages = productDetailImages;
	}
	public int getReviewCount() {
		return reviewCount;
	}
	public void setReviewCount(int reviewCount) {
		this.reviewCount = reviewCount;
	}
	public int getSaleCount() {
		return saleCount;
	}
	public void setSaleCount(int saleCount) {
		this.saleCount = saleCount;
	}
	
	
}
