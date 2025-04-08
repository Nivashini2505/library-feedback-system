import psycopg2
import os
import dotenv
dotenv.load_dotenv()

connection = psycopg2.connect(database=os.getenv('SUPABASE_DATABASE'),
                              user=os.getenv('SUPABASE_USER'),
                              password=os.getenv('SUPABASE_PASSWORD'),
                              host=os.getenv('SUPABASE_HOST'),
                              port=os.getenv('SUPABASE_PORT'))
cursor = connection.cursor()

# cursor.execute('INSERT INTO "Students" (roll_no, "Name") VALUES (%s,%s)',('23N202','Aagash'))



def check_spam_feedback(roll_no):
    '''This function checks if the user has already submitted feedback in the past 30 days or not'''
    pass

