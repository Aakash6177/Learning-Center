from flask import Flask, jsonify, json, request

app = Flask(__name__)
with open('./users.json') as f:
    data = json.load(f)

users_arr = data['users']
@app.route('/', methods=['GET'])
def getJSON():
    return data

@app.route('/users', methods=['GET'])
def getUsers():
    return jsonify(data['users'])

@app.route('/users/<int:user_id>', methods=['GET'])
def getUser(user_id):
    index = user_id - 1
    if (index >= 0 and index <= len(users_arr)):
        return jsonify(users_arr[index])

    return "User not found", 404

@app.route('/users/post', methods=['POST'])
def createUser():
    user_data = request.json
    user_data['id'] = len(users_arr) + 1
    users_arr.append(user_data)

    with open('./users.json', 'w') as f:
        json.dump(data, f)

    return jsonify({'id': user_data['id']}), 201

@app.route('/users/<int:user_id>', methods=['PUT'])
def updateUser(user_id):
    index = user_id - 1
    if (index >= 0 and index <= len(users_arr)):
        # Update the user data
        user_data = request.json
        users_arr[index].update(user_data)
        # Update the data dictionary and write to file
        data['users'] = users_arr
        with open('./users.json', 'w') as f:
            json.dump(data, f)
        return "User updated", 200
    return "User not found", 404

@app.route('/users/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    global users_arr
    index = user_id - 1
    if (index >= 0 and index <= len(users_arr)):
        del users_arr[index]
        data['users'] = users_arr
        with open('./users.json', 'w') as f:
            json.dump(data, f)
        return "User with ID {} deleted successfully".format(user_id), 200
    else:
        return "User not found", 404

if __name__ == '__main__':
    app.run(port=3000, debug=True)
