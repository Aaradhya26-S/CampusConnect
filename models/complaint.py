from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Complaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    priority = db.Column(db.String(20), nullable=False)
    location = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    status = db.Column(db.String(30), default="Pending")

    def __repr__(self):
        return f"<Complaint {self.id}: {self.title}>"