import graphene
from django.contrib.auth import get_user_model
from graphene_django import DjangoObjectType
from graphql_extensions.auth.decorators import (login_required,
                                                staff_member_required)

from ..models import Dataset, File, User
from .file import FileType, FileUploadType


class DatasetType(DjangoObjectType):
    files = graphene.List(FileType)

    class Meta:
        model = Dataset

    def resolve_files(self, info, **kwargs):
        return self.files.all()


class DatasetQuery(graphene.ObjectType):
    all_datasets = graphene.List(DatasetType)
    users_datasets = graphene.List(DatasetType, username=graphene.String())
    dataset = graphene.Field(
        DatasetType, username=graphene.String(), slug=graphene.String())

    def resolve_all_datasets(self, info, **kwargs):
        return Dataset.objects.all()

    def resolve_users_datasets(self, info, username=None, **kwargs):
        if info.context.user.is_anonymous:
            return None
        if not username:
            return info.context.user.datasets.all()
        return User.objects.get(username=username).datasets.all()

    def resolve_dataset(self, info, username, slug, **kwargs):
        user = User.objects.get(username=username)
        return Dataset.objects.get(created_by=user, slug=slug)


class CreateDataset(graphene.Mutation):
    dataset = graphene.Field(DatasetType)

    class Arguments:
        name = graphene.String(required=True)
        readme = graphene.String()
        files = FileUploadType()

    @login_required
    def mutate(self, info, name, readme=None, **kwargs):
        dataset = Dataset(name=name,
                          created_by=info.context.user,
                          readme=readme,
                          **kwargs)
        dataset.save()
        for f in info.context.FILES.getlist('files'):
            dataset.files.create(file=f,
                                 created_by=info.context.user)

        return CreateDataset(dataset=dataset)


class DatasetMutation(graphene.ObjectType):
    create_dataset = CreateDataset.Field()
