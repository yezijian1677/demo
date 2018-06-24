package tmalltest.bean;

public class User {
	private String password;
	private String name;
	private int id;
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	
	public String AnonymousName() {
		if(null == name)
			return null;
		if(name.length() == 2)
			return name.substring(0, 1)+"*";
		if(name.length()<1)
			return "*";
		
		//隐藏名字，把中间的字符变成星号
		char[] cs = name.toCharArray();
		for(int i=1; i<name.length()-1;i++) {
			cs[i] = '*';
		}
		return new String(cs);
	}
	
}
